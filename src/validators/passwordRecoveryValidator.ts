const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordRecoveryFormValues = {
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type PasswordRecoveryErrors = Partial<
  Record<keyof PasswordRecoveryFormValues, string>
>;

export function validatePasswordRecoveryForm(values: PasswordRecoveryFormValues) {
  const errors: PasswordRecoveryErrors = {};
  const email = values.email.trim();

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um email valido.";
  }

  if (values.password.length < 8) {
    errors.password = "A senha deve ter pelo menos 8 caracteres.";
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Use letras e numeros na senha.";
  }

  if (values.passwordConfirmation !== values.password) {
    errors.passwordConfirmation = "As senhas precisam ser iguais.";
  }

  return errors;
}
