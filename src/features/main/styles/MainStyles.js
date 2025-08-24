// 메인 페이지 스타일 상수들
export const colors = {
  primary: '#40ea87',
  secondary: '#2ad948',
  accent: '#ffcd6a',
  background: '#fefff5',
  backgroundGradient: 'linear-gradient(180deg, #f8fffe 0%, #FEFFF5 100%)',
  headerGradient: 'linear-gradient(135deg, #f8fffe 0%, #fefff5 100%)',
  characterGradient: 'radial-gradient(circle at 30% 30%, #7ef7a8, #4ae882, #2ad948)',
  text: {
    primary: '#111111',
    secondary: '#555555',
    name: '#2d4a3a',
    title: '#41604c',
    mission: '#333333',
    emotion: '#1a201c',
    emotionQuestion: '#666666'
  },
  border: {
    light: '#e0e0e0',
    nav: '#e8e8e8',
    emotion: 'rgba(109, 194, 255, 0.2)'
  },
  shadow: {
    character: '0 10px 30px rgba(42, 217, 72, 0.3)',
    stat: '0 2px 10px rgba(64, 234, 135, 0.1)',
    emotion: '0 4px 20px rgba(0, 149, 255, 0.1)',
    nav: '0 -1px 10px rgba(0, 0, 0, 0.05)',
    desktop: '0 10px 30px rgba(0, 0, 0, 0.1)'
  }
};

export const sizes = {
  maxWidth: '430px',
  header: {
    height: '200px',
    heightMobile: '180px'
  },
  character: {
    size: '120px',
    sizeMobile: '100px',
    emoji: '40px',
    emojiMobile: '35px'
  },
  stat: {
    height: '35px',
    icon: '22px',
    growth: '140px',
    points: '80px',
    level: '70px'
  },
  mission: {
    minHeight: '60px',
    emoji: '18px',
    check: '24px'
  },
  emotion: {
    chart: '60px'
  },
  nav: {
    height: '75px',
    item: '60px',
    icon: '24px'
  }
};

export const typography = {
  greeting: {
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: 1.4
  },
  name: {
    fontWeight: 600
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600
  },
  stat: {
    label: {
      fontSize: '12px',
      fontWeight: 600
    },
    value: {
      fontSize: '12px',
      fontWeight: 900
    },
    icon: {
      fontSize: '10px',
      fontWeight: 900
    }
  },
  mission: {
    text: {
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    check: {
      fontSize: '14px'
    }
  },
  emotion: {
    question: {
      fontSize: '10px',
      fontWeight: 400
    },
    action: {
      fontSize: '14px',
      fontWeight: 600
    },
    chart: {
      fontSize: '30px'
    }
  }
};

export const breakpoints = {
  mobile: '375px',
  desktop: '431px'
};

export const animations = {
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  delays: {
    mission1: '0.1s',
    mission2: '0.2s',
    mission3: '0.3s',
    mission4: '0.4s'
  }
};
