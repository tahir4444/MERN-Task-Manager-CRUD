import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h1 className="card-title mb-4">Welcome, {user?.name}!</h1>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body">
                        <h5 className="card-title">Total Tasks</h5>
                        <p className="card-text display-4">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body">
                        <h5 className="card-title">Completed</h5>
                        <p className="card-text display-4">0</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-warning text-white">
                      <div className="card-body">
                        <h5 className="card-title">Pending</h5>
                        <p className="card-text display-4">0</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="mb-4">Recent Tasks</h2>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan="4" className="text-center">No tasks found</td>
                        </tr>
                      </tbody>
                    </table>
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

export default DashboardPage; 