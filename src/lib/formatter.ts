/* 포맷 페이지(유튜브 구독자, 조회수 등) */

/* 구독자 수 (소수점 한 자리) */
export const formatSubscriberCount = (count: number): string => {
    if (count >= 100_000_000) {
        return `${(count / 100_000_000).toFixed(1).replace(/\.0$/, "")}억`;
    } else if (count >= 10_000) {
        return `${(count / 10_000).toFixed(1).replace(/\.0$/, "")}만`;
    } else {
        return count.toLocaleString(); // 예: 8,000
    }
}

/* 조회 수 */
export const formatViewCount = (count: number): string => {
    if (count >= 100_000_000) {
        return `${(count / 100_000_000).toFixed(1).replace(/\.0$/, "")}억회`;
    } else if (count >= 10_000) {
        return `${(count / 10_000).toFixed(1).replace(/\.0$/, "")}만회`;
    } else {
        return `${count.toLocaleString()}회`;
    }
};

/* 상대 시간 */
export const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // 초 단위

    if (diff < 60) return `${Math.floor(diff)}초 전`;
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}개월 전`;
    return `${Math.floor(diff / 31536000)}년 전`;
};