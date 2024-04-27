"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

export const sendEmail = async (email: string, isSetting: boolean) => {
  if (isSetting) {
    // 현재 세션에 있는 사용자
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    // db에 있는 사용자
    const dbUser = await getUserById(user.id as string);
    if (!dbUser) return { error: "Unauthorized" };

    if (email === user.email && !!user.emailVerified) {
      return { isVerified: true, error: "Email authentication is completed" };
    }

    // 이메일을 변경했는데
    if (email && email !== user.email) {
      const existingUser = await getUserByEmail(email);

      // 변경한 이메일이 db에 있는데 그 사용자 아이디가 지금 변경하려고 시도한 사용자와 다른 사람인 경우
      // 즉, 이메일을 변경하려고 했는데 그 이메일을 이미 다른 사람이 쓰고 있는 경우
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" };
      }
    }
  }
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Verification email sent!" };
};
