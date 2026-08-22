const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginErrors = Partial<Record<keyof LoginFormValues, string>>;

export function validateLoginForm(values: LoginFormValues) {
  const errors: LoginErrors = {};
  const email = values.email.trim();

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um email valido.";
  }

  if (!values.password) {
    errors.password = "Informe sua senha.";
  }

  return errors;
}
