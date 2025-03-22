import { Button, Result } from 'antd';
import Link from 'next/link';

function Custom500Component({ children }) {
  return (
    <div
      style={{ height: 700, textAlign: 'center', width: '100%', padding: 50 }}
    >
      <Result
        status="500"
        title="Sorry, something broke. Will be fixed soon..."
        subTitle={children}
        extra={
          <Button type="primary">
            <Link href="/">Back Home</Link>
          </Button>
        }
      />
    </div>
  );
}

export default Custom500Component;
