"use server";

import { getKcal, getNutrientRatio } from "@/data/meal";
import { getTranslations } from "next-intl/server";

interface ErrorData {
  error: string;
  kcal?: undefined;
  carbo?: undefined;
  protein?: undefined;
  fat?: undefined;
}

export interface NutritionData {
  kcal: number;
  carbo: number;
  protein: number;
  fat: number;
  error?: undefined;
}

export type TableData = ErrorData | NutritionData;

// 식품군 하루 단위수 설정을 위한 목표 칼로리, 탄단지 중량 계산 함수
export const calcDayExchangeUnitTableData = async (mealPlanId: string) => {
  const t = await getTranslations("error");

  const kcal = await getKcal(mealPlanId);
  if (!kcal) return { error: t("invalid-access-error") };

  const nutrientRatio = await getNutrientRatio(mealPlanId);
  if (!nutrientRatio) return { error: t("invalid-access-error") };

  const carbo = Math.round((kcal * nutrientRatio.carbo_ratio) / 100 / 4);
  const protein = Math.round((kcal * nutrientRatio.protein_ratio) / 100 / 4);
  const fat = Math.round((kcal * nutrientRatio.fat_ratio) / 100 / 9);

  return { kcal, carbo, protein, fat };
};
