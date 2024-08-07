"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getTranslations } from "next-intl/server";

// 교환 단위수 식단 상세페이지에서 종합 결과 보여줄 데이터
export const getMealPlanResultByMealPlanId = async (mealPlanId: string) => {
  try {
    const mealPlan = await db.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: {
        calcBasicInfo: true,
        nutrientRatio: true,
        setNutrientValue: true,
      },
    });
    return mealPlan;
  } catch (error) {
    console.log("getMealPlanResultByMealPlanId Error::", { error });

    return null;
  }
};

export const deleteUnFinishedMealPlanByUserId = async (userId: string) => {
  const t = await getTranslations("error")

  if (!userId) return null;

  // 요청 사용자, 접속 사용자 확인
  const _currentUser = await currentUser();
  if (!_currentUser || _currentUser.id !== userId) return null;

  try {
    const incompleteMealPlans = await db.mealPlan.findMany({
      where: {
        userId,
        OR: [
          { calcBasicInfo: null },
          { nutrientRatio: null },
          { dayExchangeUnit: null },
          { setNutrientValue: null },
          { mealUnits: { none: {} } },
        ],
      },
      include: {
        calcBasicInfo: true,
        nutrientRatio: true,
        dayExchangeUnit: true,
        setNutrientValue: true,
        mealUnits: true,
      },
    });

    // 미완료된 MealPlans 삭제
    const deletePromises = incompleteMealPlans.map((mealPlan) =>
      db.mealPlan.delete({
        where: { id: mealPlan.id },
      })
    );

    await Promise.all(deletePromises);

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { error: t("delete-unfinished-meal-plan-error") };
  }
};

// TODO: 완성된 MealPlans 전체 불러오는 함수
export const getMealPlansByUserId = async (userId: string) => {
  if (!userId) return null;
  const deleteIncompleteMealPlansRes = await deleteUnFinishedMealPlanByUserId(
    userId
  );
  if (deleteIncompleteMealPlansRes?.ok) {
    try {
      const mealPlans = await db.user.findUnique({
        where: { id: userId },
        include: {
          mealPlans: {
            include: {
              calcBasicInfo: true,
            },
            orderBy: {
              createdAt: "desc", // createdAt 기준으로 내림차순 정렬
            },
          },
        },
      });
      return mealPlans?.mealPlans;
    } catch (error) {
      console.log("getMealPlans Error::", { error });

      return null;
    }
  } else return null;
};

export const getMealPlan = async (mealPlanId: string | undefined) => {
  if (!mealPlanId) return null;
  try {
    const mealPlan = await db.mealPlan.findUnique({
      where: { id: mealPlanId },
    });
    return mealPlan;
  } catch (error) {
    console.log("getMealPlan Error::", { error });

    return null;
  }
};

export const getMealPlanIdWithUrl = async (searchParams: {
  [key: string]: string | undefined;
}) => {
  const mealPlanId = searchParams["mealPlanId"];

  const existingMealPlan = await getMealPlan(mealPlanId);
  if (existingMealPlan?.id) {
    return existingMealPlan.id;
  } else return null;
};

export const getBasicInfo = async (mealPlanId: string | null | undefined) => {
  if (!mealPlanId) return null;
  try {
    const basicInfo = await db.calcBasicInfo.findUnique({
      where: { mealPlanId },
    });
    return basicInfo;
  } catch (error) {
    console.log("getBasicInfo Error::", { error });

    return null;
  }
};

export const getKcal = async (mealPlanId: string | null | undefined) => {
  if (!mealPlanId) return null;
  try {
    const basicInfo = await db.calcBasicInfo.findUnique({
      where: { mealPlanId },
    });
    return basicInfo?.energy_requirement;
  } catch (error) {
    console.log("getBasicInfo Error::", { error });

    return null;
  }
};

export const getNutrientRatio = async (
  mealPlanId: string | null | undefined
) => {
  if (!mealPlanId) return null;
  try {
    const nutrientRatio = await db.nutrientRatio.findUnique({
      where: { mealPlanId },
    });
    return nutrientRatio;
  } catch (error) {
    console.log("getNutrientRatio Error::", { error });

    return null;
  }
};

export const getDayExchangeUnit = async (
  mealPlanId: string | null | undefined
) => {
  if (!mealPlanId) return null;
  try {
    const dayExchangeUnit = await db.dayExchangeUnit.findUnique({
      where: { mealPlanId },
    });
    return dayExchangeUnit;
  } catch (error) {
    console.log("getDayExchangeUnit Error::", { error });

    return null;
  }
};

export const getMealUnits = async (mealPlanId: string | null | undefined) => {
  if (!mealPlanId) return null;
  try {
    const mealUnits = await db.mealUnit.findMany({
      where: { mealPlanId: mealPlanId },
    });
    return mealUnits;
  } catch (error) {
    console.log("getMealUnits Error::", { error });

    return null;
  }
};
