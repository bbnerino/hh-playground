import { NextRequest, NextResponse } from "next/server";
import sqlite3 from "sqlite3";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10000", 10);
  const offset = (page - 1) * limit;

  try {
    const db = new sqlite3.Database("src/app/db/mydb.sqlite");
    let sql = "SELECT * FROM review_data";
    const params: string[] = [];

    if (productId) {
      sql += " WHERE 상품번호 = ?";
      params.push(productId);
    }

    // 전체 개수 쿼리
    const total = await new Promise<number>((resolve, reject) => {
      let countSql = "SELECT COUNT(*) as count FROM review_data";
      const countParams: string[] = [];
      if (productId) {
        countSql += " WHERE 상품번호 = ?";
        countParams.push(productId);
      }
      db.get(countSql, countParams, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // LIMIT/OFFSET 추가
    sql += " LIMIT ? OFFSET ?";
    params.push(limit.toString(), offset.toString());

    // 데이터 쿼리
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      });
    });

    return NextResponse.json({ total, page, limit, rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "REVIEW API error" }, { status: 500 });
  }
}
