
interface Props {
    query: string;
}

export function NoSearchResults({ query }: Props) {
    return (
        <div className="text-center py-20 text-gray-400">
            No results found for "{query}"
        </div>
    );
}