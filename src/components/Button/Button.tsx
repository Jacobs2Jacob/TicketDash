import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'ghost';
};

const Button = ({ variant = 'primary', className = '', ...rest }: ButtonProps) => {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${className}`}
            {...rest}
        />
    );
};

export default Button;