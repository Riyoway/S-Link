// pages/404.js
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <Link href="/">
        <a>トップページへ戻る</a>
      </Link>
    </div>
  );
}
