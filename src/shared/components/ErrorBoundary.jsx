import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다
    console.error('❌ [ERROR BOUNDARY] React 에러 발생:', error);
    console.error('📍 [ERROR BOUNDARY] 에러 정보:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#d63031', marginBottom: '10px' }}>
            🚨 애플리케이션 오류가 발생했습니다
          </h2>
          <p style={{ color: '#636e72', marginBottom: '15px' }}>
            페이지를 새로고침하거나 나중에 다시 시도해주세요.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', color: '#74b9ff' }}>
                개발자 정보 (클릭하여 확장)
              </summary>
              <pre style={{
                backgroundColor: '#2d3436',
                color: '#ddd',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                marginTop: '10px',
                overflow: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    // 에러가 없으면 자식 컴포넌트를 그대로 렌더링
    return this.props.children;
  }
}

export default ErrorBoundary;