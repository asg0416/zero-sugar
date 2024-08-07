"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas/auth-index";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useEffect, useTransition } from "react";
import { useAlertState } from "@/hooks/useAlertState";
import { reset } from "@/actions/reset";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { useTranslations } from "next-intl";

export const NewPasswordForm = () => {
  const te = useTranslations("error");
  const t = useTranslations("auth-new-pwd-form");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { success, error, setSuccess, setError, setClear } = useAlertState();

  /**
   * 서버액션 중 pending 상태 처리
   * startTransition으로 서버 액션 감싼 뒤 로딩 처리 필요한곳에 isPending 상태 값 사용
   */
  const [isPending, startTransition] = useTransition();

  // form
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // form 제출 함수
  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setClear();

    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data.success) {
          setSuccess(data?.success);
          return;
        }
        setError(data?.error);
      });
    });
  };

  useEffect(() => {
    return () => {
      setClear();
    };
  }, []);

  return (
    <CardWrapper
      headerHeader={t("header")}
      headerLabel={t("header-desc")}
      backButtonLabel={t("back-button-label")}
      backButtonHref="/auth/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form-label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.password &&
                      te(form.formState.errors.password.message)}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            {t("button-label")}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
