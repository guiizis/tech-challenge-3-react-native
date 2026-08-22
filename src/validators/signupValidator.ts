const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  acceptedPolicy: boolean;
};

export type SignupErrors = Partial<Record<keyof SignupFormValues, string>>;

export function validateSignupForm(values: SignupFormValues) {
  const errors: SignupErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (name.length < 3) {
    errors.name = "Informe um nome com pelo menos 3 caracteres.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um email valido.";
  }

  if (values.password.length < 8) {
    errors.password = "A senha deve ter pelo menos 8 caracteres.";
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Use letras e numeros na senha.";
  }

  if (!values.acceptedPolicy) {
    errors.acceptedPolicy = "Aceite a Politica de Privacidade para continuar.";
  }

  return errors;
}
