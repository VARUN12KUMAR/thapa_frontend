import type { StockStatus } from '../types/product';
import { stockLabel } from '../utils/format';

export function StockBadge({ status }: { status: StockStatus }) {
  const tone =
    status === 'available'
      ? 'ok'
      : status === 'sold_out'
        ? 'danger'
        : 'warn';

  return <span className={`badge ${tone}`}>{stockLabel(status)}</span>;
}
