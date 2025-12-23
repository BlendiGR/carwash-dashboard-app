interface SpinnerProps {
    size?: number;
    ringColor?: string;
    spinColor?: string;
}

export function Spinner({
    size = 24,
    ringColor = "rgba(0, 0, 0, 0.1)",
    spinColor = "#3b82f6"
}: SpinnerProps) {
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `${Math.max(2, size / 8)}px solid ${ringColor}`,
                borderTopColor: spinColor,
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
            }}
        >
            <style jsx>{`
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
