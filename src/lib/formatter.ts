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