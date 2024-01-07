import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './App.module.css';
import { useState } from 'react';

interface IFormState {
  name: string;
  email: string;
}

function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormState>();
   
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormState> = async (data) => {
    setIsLoading(true);

   try {
      const response = await fetch('http://localhost:5000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const serverData = await response.json();

         if (response.status === 400) {
         setError(serverData.message);
         } else {
         setIsSuccess(true);
         reset();
         }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };
   
   const handleEmailChange = () => {
        setError(null);
      };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSuccess ? (
          <div className={styles.success}>
            Thank you! Your form has been submitted. Expect a letter to the specified email address with detailed information about the payment method and the date of receipt of the game.
          </div>
        ) : (
          <>
            <h1>Pre-order the game right now</h1>
            <input type="text" placeholder="Enter your name" {...register('name')} />
                    <input type="email" placeholder="Enter your email" {...register('email', { required: 'Email is required' })}
                    onChange={handleEmailChange}/>
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            {error && <p className={styles.error}>{error}</p>}
            <button disabled={isLoading}>{isLoading ? 'Wait...' : 'I want to pre-order GTA 6'}</button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;
