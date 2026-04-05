'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import { initAuth } from '@/lib/store/authSlice';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import { 
  useGetTasksQuery, 
  useDeleteTaskMutation, 
  useToggleTaskMutation 
} from '@/lib/store/taskApi';
import { Modal, ButtonGroup, Button } from 'react-bootstrap';

// Standard icons as SVGs to avoid dependency issues
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data, isLoading, refetch } = useGetTasksQuery({ search, status, page }, { skip: !isAuthenticated });
  const [deleteTask] = useDeleteTaskMutation();
  const [toggleTask] = useToggleTaskMutation();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />
      
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5 mt-4">
          <div>
            <h1 className="fw-bold mb-1 text-white" style={{ fontFamily: 'Outfit' }}>Your Pipeline</h1>
            <p className="text-secondary mb-0">Stay organized and productive with QuantumTask.</p>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <ButtonGroup className="shadow-sm">
              <Button 
                variant={view === 'grid' ? 'primary' : 'outline-primary'} 
                onClick={() => setView('grid')}
                className="border-0 bg-opacity-10 d-flex align-items-center"
                style={{ background: view === 'grid' ? '' : 'rgba(99, 102, 241, 0.1)' }}
              >
                <GridIcon />
              </Button>
              <Button 
                variant={view === 'list' ? 'primary' : 'outline-primary'} 
                onClick={() => setView('list')}
                className="border-0 bg-opacity-10 d-flex align-items-center"
                style={{ background: view === 'list' ? '' : 'rgba(99, 102, 241, 0.1)' }}
              >
                <ListIcon />
              </Button>
            </ButtonGroup>
            <button className="btn btn-primary px-4 fw-bold shadow-sm" onClick={() => { setEditTask(null); setShowModal(true); }}>
              + Create New Task
            </button>
          </div>
        </div>

        <div className="glass-card p-4 mb-4 border-primary border-opacity-10">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <input 
                className="form-control" 
                placeholder="Search tasks by title..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="col-md-2">
               <button className="btn btn-outline-primary w-100 fw-bold border-0" onClick={() => refetch()} style={{ background: 'rgba(99, 102, 241, 0.1)' }}>Refetch</button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
            </div>
          ) : data?.tasks.length > 0 ? (
            data.tasks.map((task: any) => (
              <div className={view === 'grid' ? 'col-12 col-lg-6 animate-fade-in' : 'col-12 animate-fade-in'} key={task.id}>
                <div className={`glass-card p-4 h-100 d-flex ${view === 'grid' ? 'flex-column' : 'flex-row align-items-center'} shadow-hover transition-standard`}>
                  <div className="flex-grow-1 pe-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className={`fw-bold mb-1 ${task.status === 'COMPLETED' ? 'text-decoration-line-through opacity-50' : ''}`}>
                        {task.title}
                      </h4>
                      {view === 'grid' && (
                        <span className={`badge ${task.status === 'COMPLETED' ? 'bg-success text-white' : 'bg-primary text-white'} px-3 py-2 rounded-pill small fw-bold`}>
                          {task.status}
                        </span>
                      )}
                    </div>
                    <p className="text-secondary small mb-0">{task.description || 'No additional details.'}</p>
                  </div>
                  
                  <div className={`d-flex gap-2 ${view === 'grid' ? 'mt-auto pt-3 border-top' : 'ms-auto'} border-white border-opacity-10`}>
                    {view === 'list' && (
                      <span className={`badge ${task.status === 'COMPLETED' ? 'bg-success text-white' : 'bg-primary text-white'} d-flex align-items-center px-3 rounded-pill small fw-bold mx-2`}>
                        {task.status}
                      </span>
                    )}
                    <button 
                      className={`btn btn-sm ${task.status === 'COMPLETED' ? 'btn-outline-warning' : 'btn-outline-success'} fw-bold border-0 bg-opacity-10`} 
                      style={{ background: task.status === 'COMPLETED' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(25, 135, 84, 0.1)', minWidth: '80px' }}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.status === 'COMPLETED' ? 'Undo' : 'Done'}
                    </button>
                    <button className="btn btn-sm btn-outline-light fw-bold border-0" style={{ background: 'rgba(255, 255, 255, 0.05)' }} onClick={() => { setEditTask(task); setShowModal(true); }}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger fw-bold border-0" style={{ background: 'rgba(220, 53, 69, 0.1)' }} onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="glass-card p-5">
                <p className="text-secondary fs-5 mb-0">You're all caught up! No tasks found here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card border-0" dialogClassName="modal-dark">
        <Modal.Header closeButton closeVariant="white" className="border-0 px-4 pt-4 pb-0">
          <Modal.Title className="fw-bold text-white fs-4" style={{ fontFamily: 'Outfit' }}>
            {editTask ? 'Update Task' : 'Add New Task'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <TaskForm 
            onSuccess={() => setShowModal(false)}
            initialValues={editTask}
          />
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .transition-standard {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .transition-standard:hover {
          transform: translateY(-2px);
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
}
