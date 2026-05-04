import { WriteReviewPrompt } from '../Reviews/WriteReviewPrompt';
import { useDictionary } from '@/components/providers/DictionaryProvider';

interface EmptyRatingAndReviewsProps {
    onWriteReview: () => void;
    canReview?: boolean;
}

const EmptyRatingAndReviews = ({ onWriteReview, canReview }: EmptyRatingAndReviewsProps) => {
    const { product: productDict } = useDictionary();
    const t = productDict;
    return (
        <WriteReviewPrompt
            variant="centered"
            onWriteReview={onWriteReview}
            canReview={canReview}
            description={t?.reviews?.empty}
            image="/no-comment.png"
        />
    )
}

export default EmptyRatingAndReviews
