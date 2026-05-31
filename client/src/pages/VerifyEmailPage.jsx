import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldCheck, Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/apiClient.js';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided. Please check your verification link.');
        return;
      }

      try {
        const response = await apiClient.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Your email address has been successfully verified!');
      } catch (error) {
        setStatus('error');
        setMessage(error?.message || 'Verification failed. The token may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Verify Email | Emergencycare360</title>
      </Helmet>

      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Email Verification</h2>
          <p className="mt-2 text-sm text-muted-foreground">Emergencycare360 Account Activation</p>
        </div>

        <div className="mt-8 p-6 bg-muted/40 rounded-xl border border-border/40 text-center min-h-[160px] flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm font-medium text-foreground">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
              <p className="text-base font-semibold text-green-600 dark:text-green-400">Success!</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-base font-semibold text-destructive">Verification Failed</p>
              <p className="text-sm text-muted-foreground">{message}</p>
            </>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {status === 'success' && (
            <Button
              onClick={() => navigate('/login')}
              className="w-full font-bold h-12 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl flex items-center justify-center gap-2 group transition-all duration-200"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}

          {status === 'error' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/signup')}
                className="flex-1 font-semibold h-12 rounded-xl transition-all duration-200"
              >
                Sign Up Again
              </Button>
              <Button
                onClick={() => navigate('/login')}
                className="flex-1 font-semibold h-12 rounded-xl transition-all duration-200"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <Button
              disabled
              className="w-full font-semibold h-12 rounded-xl bg-muted text-muted-foreground"
            >
              Verifying...
            </Button>
          )}

          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-150">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
