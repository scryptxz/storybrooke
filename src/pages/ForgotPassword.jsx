import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthLayout } from '../layouts/AuthLayout';
import axios from 'axios';

const validationSchema = yup.object({
  email: yup.string().email('E-mail inválido').required('Campo obrigatório'),
});

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = async data => {
    await axios('https://localhost:5278/api/Users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }).then(res => {
      const foundUser = res.data.find(a => a.email === data.email);
      if (foundUser) {
        console.log('ACHOU');
        return navigate(`/reset-password?email=${data.email}`);
      } else {
        return toast.error('Usuário não encontrado.');
      }
    });
  };

  return (
    <AuthLayout>
      <h2 className="mb-10 text-center text-2xl font-bold">
        Esqueci minha senha
      </h2>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input name="email" type="email" placeholder="E-mail" />

          <Button type="submit" className="w-full">
            Enviar
          </Button>
        </form>
      </FormProvider>

      <Link
        to="/login"
        className="mt-10 block text-center text-sm font-medium text-gray-600 hover:underline"
      >
        Ir para login
      </Link>
    </AuthLayout>
  );
};
