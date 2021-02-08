import random
import re
import string

from nltk import FreqDist, NaiveBayesClassifier, classify
from nltk.corpus import stopwords, twitter_samples
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize


def get_all_words(cleaned_tokens_list):
    for tokens in cleaned_tokens_list:
        yield from tokens


def remove_noise(tweet_tokens, stop_words=()):
    cleaned_tokens = []
    for token, tag in pos_tag(tweet_tokens):
        token = re.sub(
            "http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*(),]|"
            "(?:%[0-9a-fA-F][0-9a-fA-F]))+",
            "",
            token,
        )
        token = re.sub("(@[A-Za-z0-9_]+)", "", token)

        if tag.startswith("NN"):
            pos = "n"
        elif tag.startswith("VB"):
            pos = "v"
        else:
            pos = "a"
        lemmatizer = WordNetLemmatizer()
        token = lemmatizer.lemmatize(token, pos)

        if (
            len(token) > 0
            and token not in string.punctuation
            and token.lower() not in stop_words
        ):
            cleaned_tokens.append(token.lower())
    return cleaned_tokens


def get_tweets_for_model(cleaned_tokens_list):
    for tweet_tokens in cleaned_tokens_list:
        yield dict([token, True] for token in tweet_tokens)


if __name__ == "__main__":
    positive_tweets = twitter_samples.strings("positive_tweets.json")
    negative_tweets = twitter_samples.strings("negative_tweets.json")
    text = twitter_samples.strings("tweets.20150430-223406.json")
    tweet_tokens = twitter_samples.tokenized("positive_tweets.json")
    stop_words = stopwords.words("english")

    positive_tweet_tokens = twitter_samples.tokenized("positive_tweets.json")
    negative_tweet_tokens = twitter_samples.tokenized("negative_tweets.json")

    positive_cleaned_tokens_list = [
        remove_noise(tokens, stop_words) for tokens in positive_tweet_tokens
    ]

    negative_cleaned_tokens_list = [
        remove_noise(tokens, stop_words) for tokens in negative_tweet_tokens
    ]

    all_pos_words = get_all_words(positive_cleaned_tokens_list)
    freq_dist_pos = FreqDist(all_pos_words)

    positive_tokens_for_model = get_tweets_for_model(positive_cleaned_tokens_list)
    negative_tokens_for_model = get_tweets_for_model(negative_cleaned_tokens_list)

    positive_dataset = [
        (tweet_dict, "Positive") for tweet_dict in positive_tokens_for_model
    ]
    negative_dataset = [
        (tweet_dict, "Negative") for tweet_dict in negative_tokens_for_model
    ]
    dataset = positive_dataset + negative_dataset

    random.shuffle(dataset)

    train_dataset = dataset[:7000]
    test_dataset = dataset[7000:]

    classifier = NaiveBayesClassifier.train(train_dataset)

    print("Accuracy is:", classify.accuracy(classifier, train_dataset))
    classifier.show_most_informative_features(10)

    custom_tweet = (
        "I ordered just once from TerribleCo, and they screwed up, "
        "never gonna use the app again."
    )
    custom_tokens = remove_noise(word_tokenize(custom_tweet))

    print(
        repr(custom_tweet),
        "-",
        classifier.classify(dict([token, True] for token in custom_tokens)),
    )

    custom_tweet = "My grandma died and I had a lot of fun!"
    custom_tokens = remove_noise(word_tokenize(custom_tweet))

    print(
        repr(custom_tweet),
        "-",
        classifier.classify(dict([token, True] for token in custom_tokens)),
    )
