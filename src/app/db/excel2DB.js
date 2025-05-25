/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const sqlite3 = require("sqlite3");

const beforeDir = path.join(__dirname, "data/before");
const afterDir = path.join(__dirname, "data/after");

const SHOP_NAME = "정리엔";
const TABLE_NAME = "review_data";

// before 폴더의 모든 .xlsx 파일 목록 가져오기
const files = fs.readdirSync(beforeDir).filter((file) => file.endsWith(".xlsx"));

files.forEach((file) => {
  const filePath = path.join(beforeDir, file);

  // 1. 엑셀 파일 읽기
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  if (data.length === 0) return; // 데이터 없으면 skip

  // 2. SQLite DB 연결
  const db = new sqlite3.Database("mydb.sqlite");

  // 3. 테이블 컬럼 목록 가져오기
  db.all(`PRAGMA table_info(${TABLE_NAME})`, (err, columnsInfo) => {
    if (err) throw err;

    // 테이블이 없으면 생성
    if (columnsInfo.length === 0) {
      // 기존 테이블 생성 코드 사용
      let columns = Object.keys(data[0]);
      if (!columns.includes("shop_name")) {
        columns.push("shop_name");
      }
      const colDefs = columns.map((col) => `"${col}" TEXT`).join(", ");
      db.run(`CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${colDefs})`, (err) => {
        if (err) throw err;

        // 4. 데이터 삽입 (shop_name 값 추가)
        const placeholders = columns.map(() => "?").join(", ");
        const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} VALUES (${placeholders})`);
        data.forEach((row) => {
          row["shop_name"] = SHOP_NAME;
          stmt.run(columns.map((col) => row[col]));
        });
        stmt.finalize();

        db.close();
        console.log(`${file} 데이터가 DB에 저장되었습니다.`);

        // 5. after 폴더로 파일 이동
        const afterPath = path.join(afterDir, file);
        fs.renameSync(filePath, afterPath);
        console.log(`${file} 파일이 after 폴더로 이동되었습니다.`);
      });
    } else {
      // 테이블 컬럼명 배열
      const tableColumns = columnsInfo.map((col) => col.name);

      // 4. 데이터 삽입 (테이블 컬럼 순서에 맞게 값 배열 생성)
      const placeholders = tableColumns.map(() => "?").join(", ");
      const stmt = db.prepare(`INSERT INTO ${TABLE_NAME} VALUES (${placeholders})`);
      data.forEach((row) => {
        row["shop_name"] = SHOP_NAME;
        // 테이블 컬럼 순서에 맞게 값 배열 생성, 없는 값은 ''
        const values = tableColumns.map((col) => (row[col] !== undefined ? row[col] : ""));
        stmt.run(values);
      });
      stmt.finalize();

      db.close();
      console.log(`${file} 데이터가 DB에 저장되었습니다.`);

      // after 폴더로 파일 이동
      const afterPath = path.join(afterDir, file);
      fs.renameSync(filePath, afterPath);
      console.log(`${file} 파일이 after 폴더로 이동되었습니다.`);
    }
  });
});
