import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

// 아이콘 import
import HomeIcon from '../assets/images/uil_home-alt.svg';
import CommentIcon from '../assets/images/uil_comment-heart.svg';
import ThumbsUpIcon from '../assets/images/uil_thumbs-up.svg';
import UserIcon from '../assets/images/uil_user.svg';

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

const NavIcon = styled.img`
  width: 32px;
  height: 32px;
  opacity: 0.6;
  transition: all 0.2s ease;
  object-fit: contain;

  .nav-item.active & {
    opacity: 1;
    filter: brightness(0) saturate(100%) invert(47%) sepia(69%) saturate(582%) hue-rotate(95deg) brightness(96%) contrast(89%);
  }

  ${NavItem}.active & {
    opacity: 1;
    filter: brightness(0) saturate(100%) invert(47%) sepia(69%) saturate(582%) hue-rotate(95deg) brightness(96%) contrast(89%);
  }
`;

/**
 * 전역 네비게이션 바 컴포넌트 (하단 고정)
 * combined.html의 .bottom-nav 구조를 기반으로 구현
 * 🏠💬👍👤 아이콘들과 활성화 상태 관리
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: HomeIcon, path: '/main' },
    { id: 'mission', icon: CommentIcon, path: '/mission' },
    { id: 'recommendation', icon: ThumbsUpIcon, path: '/recommendation' },
    { id: 'mypage', icon: UserIcon, path: '/mypage' }
  ];

  // 현재 경로에 따라 활성 탭 결정
  const getActiveTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/' || currentPath === '/main') return 'home';
    if (currentPath === '/mission') return 'mission';
    if (currentPath === '/recommendation') return 'recommendation';
    if (currentPath === '/mypage') return 'mypage';
    return 'home'; // 기본값
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  const activeTab = getActiveTab();

  return (
    <BottomNav>
      {navItems.map((item) => (
        <NavItem 
          key={item.id} 
          className={activeTab === item.id ? 'active' : ''} 
          onClick={() => handleNavClick(item.path)}
        >
          <NavIcon src={item.icon} alt={item.id} />
        </NavItem>
      ))}
    </BottomNav>
  );
};

export default Navbar;