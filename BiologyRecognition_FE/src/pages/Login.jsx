// src/components/Login.js
import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login process
        setTimeout(() => {
            console.log('Đăng nhập với:', { username, password });
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
  <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"></link>
        <div className="login-page">
            {/* Left Side - Branding & Information */}
            <div className="login-left">
                <div className="brand-section">
                    <div className="logo-large">
                        <i className="fas fa-leaf"></i>
                    </div>
                    <h1 className="brand-title">Biology Admin</h1>
                    <p className="brand-subtitle">Hệ thống quản lý học liệu sinh học toàn diện</p>
                </div>
                
                <div className="features-section">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-book-open"></i>
                        </div>
                        <div className="feature-content">
                            <h3>Quản lý môn học</h3>
                            <p>Tổ chức và quản lý các môn học sinh học một cách hiệu quả</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-microscope"></i>
                        </div>
                        <div className="feature-content">
                            <h3>Tài liệu phong phú</h3>
                            <p>Kho tài liệu đa dạng với hình ảnh, video và mô phỏng 3D</p>
                        </div>
                    </div>
                    
                    <div className="feature-item">
                        <div className="feature-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="feature-content">
                            <h3>Theo dõi tiến độ</h3>
                            <p>Báo cáo chi tiết về quá trình học tập và hiệu suất</p>
                        </div>
                    </div>
                </div>
                
                <div className="decorative-elements">
                    <div className="deco-circle circle-1"></div>
                    <div className="deco-circle circle-2"></div>
                    <div className="deco-circle circle-3"></div>
                    <div className="deco-leaf leaf-1">🌿</div>
                    <div className="deco-leaf leaf-2">🍃</div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-right">
                <div className="login-container">
                    <div className="login-header">
                        <h2>Chào mừng trở lại!</h2>
                        <p>Đăng nhập vào tài khoản quản trị của bạn</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <div className="input-container">
                                <i className="fas fa-user input-icon"></i>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    placeholder="admin@biologyedu.com"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <div className="input-container">
                                <i className="fas fa-lock input-icon"></i>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Nhập mật khẩu của bạn"
                                    required 
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Ghi nhớ đăng nhập
                            </label>
                            <a href="#" className="forgot-password">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="login-btn" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Đăng nhập hệ thống
                                </>
                            )}
                        </button>
                    </form>

                    <div className="divider">
                        <span>hoặc</span>
                    </div>

                    <div className="alternative-login">
                        <button className="alt-btn google-btn">
                            <i className="fab fa-google"></i>
                            Đăng nhập với Google
                        </button>
                       
                    </div>

                    <div className="login-footer">
                        <p>Bạn chưa có tài khoản? <a href="#" className="signup-link">Đăng ký ngay</a></p>
                    </div>
                </div>

                <div className="bottom-info">
                    <p>© 2024 Biology Education System. Bảo lưu mọi quyền.</p>
                    <div className="links">
                        <a href="#">Điều khoản sử dụng</a>
                        <span>•</span>
                        <a href="#">Chính sách bảo mật</a>
                        <span>•</span>
                        <a href="#">Hỗ trợ</a>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;