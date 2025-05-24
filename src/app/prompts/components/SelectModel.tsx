import { PromptModel } from "@/types/prompts/model";
import React from "react";
import { useQuery } from "@tanstack/react-query";

const fetchModels = async () => {
  const res = await fetch("/api/gpt/models");
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
};

const SelectModel = ({ model, setModel }: { model: PromptModel; setModel: (model: PromptModel) => void }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gpt-models"],
    queryFn: fetchModels,
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading models</div>;

  const models = data?.models as PromptModel[];
  return (
    <div className="relative">
      <select
        className="w-50 px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none pr-10 focus:outline-none focus:border-gray-400 cursor-pointer"
        value={model.name}
        onChange={(e) => setModel(models.find((m) => m.name === e.target.value) as PromptModel)}
      >
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectModel;
