import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: '#ef4444', backgroundColor: '#1e293b', minHeight: '100vh', fontFamily: 'sans-serif' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f8fafc' }}>Something went wrong.</h1>
                    <div style={{ padding: '20px', backgroundColor: '#0f172a', borderRadius: '0.5rem', overflow: 'auto', border: '1px solid #334155' }}>
                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fca5a5' }}>
                            {this.state.error && this.state.error.toString()}
                        </p>
                        <details style={{ marginTop: '1rem' }}>
                            <summary style={{ cursor: 'pointer', color: '#94a3b8', fontWeight: 'medium' }}>View Stack Trace</summary>
                            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.5rem', lineHeight: '1.5' }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
