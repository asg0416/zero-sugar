"use client";

import { deleteUnFinishedMealPlanByUserId } from "@/data/meal";
import useDialog from "@/hooks/useDialog";
import { currentUser } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UrlVerifyAlertProps {
  msg?: string;
}
const UrlVerifyAlert = ({ msg }: UrlVerifyAlertProps) => {
  const t = useTranslations("error")
  const { alert } = useDialog();

  const router = useRouter();

  useEffect(() => {
    const fn = async () => {
      const user = await currentUser();
      const checked = await alert("Error", msg || t("invalid-access-error"));
      // 잘못된 접근으로 완성되지 못한 mealPlan에 접근하는 경우 해당 mealPlan 삭제하는 로직
      if (user?.id) {
        await deleteUnFinishedMealPlanByUserId(user.id);
      }
      if (checked) return router.replace("/");
    };
    fn();
  }, []);

  return null;
};

export default UrlVerifyAlert;
