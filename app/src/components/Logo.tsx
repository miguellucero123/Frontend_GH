interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
    return (
        <img
            src="/logo.jpg"
            alt="Logo Constructora GYH"
            className={`${sizeClasses[size]} rounded-lg object-cover ${className}`}
        />
    );
}
