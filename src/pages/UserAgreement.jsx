import React, { useState } from 'react';
import '../styles/UserAgreement.scss';

const sections = [
  { id: 1, title: '1. Общие положения', content: 'Используя сайт, вы соглашаетесь с данными условиями. Если вы не согласны с ними, пожалуйста, не используйте сайт.' },
  { id: 2, title: '2. Использование контента', content: 'Весь контент сайта предоставляется только для личного, некоммерческого использования.' },
  { id: 3, title: '3. Ограничение ответственности', content: 'Сайт предоставляется "как есть", администрация не несет ответственности за возможные ошибки или последствия использования.' },
  { id: 4, title: '4. Конфиденциальность', content: 'Мы уважаем вашу конфиденциальность. Персональные данные обрабатываются в соответствии с Политикой конфиденциальности.' },
  { id: 5, title: '5. Изменения соглашения', content: 'Администрация сайта оставляет за собой право вносить изменения в пользовательское соглашение без предварительного уведомления.' }
];

const UserAgreement = () => {
  const [openId, setOpenId] = useState(null);
  const toggle = id => setOpenId(openId === id ? null : id);
  return (
    <div className="user-agreement">
      <h1>Пользовательское соглашение</h1>
      <p>Добро пожаловать на сайт WanderEvents. Пожалуйста, внимательно ознакомьтесь с условиями данного соглашения перед использованием.</p>
      {sections.map(sec => (
        <div key={sec.id} className="accordion-item">
          <div className="accordion-title" onClick={() => toggle(sec.id)}>
            <span>{sec.title}</span>
            <span className={`arrow ${openId === sec.id ? 'open' : ''}`}>&#9662;</span>
          </div>
          <div className={`accordion-content ${openId === sec.id ? 'open' : ''}`}>
            <p>{sec.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAgreement;
