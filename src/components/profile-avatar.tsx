
interface ProfileAvatarProps {
    username: string;
    profilePicture?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ProfileAvatar({ username, profilePicture, size = 'md' }: ProfileAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl',
    };

    if (profilePicture) {
        return (
            <img
                src={profilePicture}
                alt={username}
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-purple-500/20`}
            />
        );
    }

    const initials = username
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Deterministic color based on username
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500',
        'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
        'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500',
        'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
        'bg-pink-500', 'bg-rose-500'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorClass = colors[Math.abs(hash) % colors.length];

    return (
        <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-bold border-2 border-white/10 select-none`}>
            {initials}
        </div>
    );
};
