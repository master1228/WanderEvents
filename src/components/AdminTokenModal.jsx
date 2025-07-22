import React, { useState } from 'react';
import { tokenManager } from '../utils/api';
import '../styles/AdminTokenModal.scss';

const AdminTokenModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('password'); // 'password' or 'token'
  const [password, setPassword] = useState('');
  const [newToken, setNewToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Секретный пароль для доступа к админ-панели
  const ADMIN_PASSWORD = 'wanderadmin2025';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setStep('token');
      setError('');
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (!newToken.trim()) {
      setError('Введите новый токен');
      return;
    }

    try {
      setError('');
      setSuccess('Подготовка инструкций для обновления...');
      
      // Подготавливаем токен и получаем инструкции для сервера
      const result = await tokenManager.updateServerToken(newToken.trim(), ADMIN_PASSWORD);
      
      if (result.success) {
        // Получаем инструкции для ручного обновления
        const instructions = tokenManager.getUpdateInstructions(newToken.trim());
        
        setSuccess(`✅ Инструкции готовы! 

📋 Шаги для обновления токена:
${instructions.instructions.join('\n')}

📄 Новое содержимое файла strapi-config.json:

${instructions.content}`);
        setNewToken('');
        
        // Сбрасываем кеш токена
        tokenManager.invalidateCache();
        
        // Не закрываем модал автоматически, чтобы пользователь мог скопировать инструкции
      } else {
        setError(`❌ Ошибка: ${result.error}`);
      }
    } catch (err) {
      setError('❌ Ошибка при подготовке инструкций: ' + err.message);
    }
  };

  const handleClose = () => {
    setStep('password');
    setPassword('');
    setNewToken('');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="admin-token-modal-overlay" onClick={handleClose}>
      <div className="admin-token-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-token-header">
          <h2>🔐 Админ-панель</h2>
          <button className="admin-token-close" onClick={handleClose}>×</button>
        </div>

        <div className="admin-token-content">
          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="admin-token-field">
                <label>Введите пароль администратора:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль..."
                  autoFocus
                />
              </div>
              {error && <div className="admin-token-error">{error}</div>}
              <button type="submit" className="admin-token-button">
                Войти
              </button>
            </form>
          ) : (
            <form onSubmit={handleTokenSubmit}>
              <div className="admin-token-field">
                <label>Новый токен Strapi API:</label>
                <textarea
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  placeholder="Вставьте новый токен здесь..."
                  rows={4}
                  autoFocus
                />
              </div>
              {error && <div className="admin-token-error">{error}</div>}
              {success && <div className="admin-token-success">{success}</div>}
              <div className="admin-token-buttons">
                <button type="button" onClick={() => setStep('password')} className="admin-token-button-secondary">
                  Назад
                </button>
                <button type="submit" className="admin-token-button">
                  Обновить токен
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="admin-token-info">
          <small>
            🌐 <strong>Глобальное обновление:</strong> Новый токен будет применен для всех пользователей после обновления файла на сервере.<br/>
            📁 <strong>Файл конфигурации:</strong> /public/strapi-config.json<br/>
            ⏱️ <strong>Время применения:</strong> 1 минута после обновления
          </small>
        </div>
      </div>
    </div>
  );
};

export default AdminTokenModal;
