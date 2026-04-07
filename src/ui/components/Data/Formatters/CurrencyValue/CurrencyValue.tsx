import Dinero from 'dinero.js';

interface IProps {
  amount: number | undefined;
  decimals?: number;
  currency?: 'USD' | 'EUR';
}

const CurrencyValue = ({ amount, decimals = 2, currency = 'USD' }: IProps) => {
  return (
    <>
      {Dinero({ amount, currency }).toFormat('$0,0.00')}
    </>
  )
}

export default CurrencyValue;