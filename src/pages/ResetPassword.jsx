import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthLayout } from '../layouts/AuthLayout';
import { useRegisteredUsers } from '../stores/useRegisteredUsers';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const validationSchema = yup.object({
  password: yup
    .string()
    .required('Campo obrigatório')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const ResetPassword = () => {
  const { registeredUsers, resetPassword } = useRegisteredUsers();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { handleSubmit } = methods;

  const onSubmit = async data => {
    console.log(data);
    const hashed = await bcrypt.hash(data.password, 10);
    axios(`https://192.168.15.40:5278/api/Users/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        password: hashed,
      },
    });
    const emailExists = registeredUsers.some(user => user.email === email);

    if (!emailExists) {
      toast.error('Não foi possível encontrar o usuário com esse e-mail.');

      return;
    }

    resetPassword(email, data.password);
    navigate('/login');
  };

  return (
    <AuthLayout>
      <h2 className="mb-10 text-center text-2xl font-bold">Nova senha</h2>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input name="password" type="password" placeholder="Senha" />

          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </FormProvider>
    </AuthLayout>
  );
};
