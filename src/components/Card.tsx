interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ${className}`}>
            {title && (
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                        {title}
                    </h2>
                </div>
            )}
            {children}
        </div>
    );
} 