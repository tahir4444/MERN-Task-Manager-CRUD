import Login from '../components/auth/Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const LoginPage = () => {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg">
              {/* Logo or Header Section */}
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0">Welcome Back</h2>
                <p className="text-white-50 mb-0 mt-2">Sign in to your account</p>
              </div>

              {/* Login Form Container */}
              <div className="card-body p-4">
                <Login />

                {/* Additional Links */}
                <div className="text-center mt-4">
                  <a
                    href="/register"
                    className="text-decoration-none text-primary"
                  >
                    Create new account
                  </a>
                </div>

                {/* Social Login Options */}
                <div className="mt-4">
                  <div className="position-relative">
                    <hr className="my-4" />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted small">Or continue with</span>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                        <span className="visually-hidden">Sign in with Google</span>
                        <svg
                          className="bi"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                        </svg>
                        Google
                      </button>
                    </div>

                    <div className="col-6">
                      <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
                        <span className="visually-hidden">Sign in with GitHub</span>
                        <svg
                          className="bi"
                          width="20"
                          height="20"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        GitHub
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
