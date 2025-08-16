import React from 'react';
import styled from 'styled-components';

// 하단 네비게이션
const BottomNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  max-width: 430px;
  height: 75px;
  background: white;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 15px;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.05);

  @media (min-width: 431px) {
    border-radius: 0 0 20px 20px;
  }
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 60px;
  height: 50px;
  padding: 0;
  transition: all 0.2s ease;
  cursor: pointer;

  &.active {
    background: none;
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
  opacity: 0.6;
  color: #666666;

  .nav-item.active & {
    opacity: 1;
    color: #40ea87;
  }

  ${NavItem}.active & {
    opacity: 1;
    color: #40ea87;
  }
`;

/**
 * 전역 네비게이션 바 컴포넌트 (하단 고정)
 * combined.html의 .bottom-nav 구조를 기반으로 구현
 * 🏠💬👍👤 아이콘들과 활성화 상태 관리
 */
const Navbar = ({ activeTab = 'home' }) => {
  const navItems = [
    { id: 'home', icon: '🏠' },
    { id: 'chat', icon: '💬' },
    { id: 'like', icon: '👍' },
    { id: 'profile', icon: '👤' }
  ];

  return (
    <BottomNav>
      {navItems.map((item) => (
        <NavItem key={item.id} className={activeTab === item.id ? 'active' : ''}>
          <NavIcon>{item.icon}</NavIcon>
        </NavItem>
      ))}
    </BottomNav>
  );
};

export default Navbar;