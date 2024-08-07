"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas/auth-index";

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
import { useTranslations } from "next-intl";

export const ResetForm = () => {
  const te = useTranslations("error")
  const t = useTranslations("auth-reset-form")
  const { success, error, setSuccess, setError, setClear, setEmail } =
    useAlertState();

  /**
   * 서버액션 중 pending 상태 처리
   * startTransition으로 서버 액션 감싼 뒤 로딩 처리 필요한곳에 isPending 상태 값 사용
   */
  const [isPending, startTransition] = useTransition();

  // form
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // form 제출 함수
  const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
    setClear();

    startTransition(() => {
      reset(values).then((data) => {
        if (data.success) {
          setEmail(values.email);
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
      backButtonLabel={t("back-to-login")}
      backButtonHref="/auth/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email-label")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="sample@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.email &&
                      te(form.formState.errors.email.message)}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" disabled={isPending} className="w-full">
            {success ? t("resend-btn") : t("send-btn")}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
