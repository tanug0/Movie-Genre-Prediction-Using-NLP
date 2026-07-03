import pandas as pd
import re
import matplotlib.pyplot as plt
import joblib
import seaborn as sns

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay

# Read Dataset
descriptions = []
genres = []

with open("dataset/train_data.txt", "r", encoding="utf-8") as file:

    for line in file:

        parts = line.split(" ::: ")

        if len(parts) >= 4:

            description = parts[3]
            genre = parts[2]

            descriptions.append(description)
            genres.append(genre)

# Create DataFrame
df = pd.DataFrame({
    "Description": descriptions,
    "Genre": genres
})

# Text Preprocessing

# Convert text to lowercase
df["Description"] = df["Description"].str.lower()

# Remove punctuation
df["Description"] = df["Description"].apply(
    lambda text: re.sub(r"[^\w\s]", "", text)
)

# Display Dataset Information
print("\nFirst 5 Rows:\n")
print(df.head())

print("\nDataset Shape:")
print(df.shape)

print("\nTop 10 Genres:\n")
print(df["Genre"].value_counts().head(10))

# Convert Text into Numbers
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=10000,
    ngram_range=(1,2),
    min_df=2
)

X = vectorizer.fit_transform(df["Description"])
y = df["Genre"]

print("\nShape After Vectorization:")
print(X.shape)

# Split Dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Data Shape:", X_train.shape)
print("Testing Data Shape:", X_test.shape)

# Train Model
model = LinearSVC(random_state=42)
model.fit(X_train, y_train)
print("\nModel Trained Successfully!")

# Prediction
y_pred = model.predict(X_test)
joblib.dump(model, "movie_genre_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
print("\nModel and Vectorizer Saved Successfully!")

# Accuracy
accuracy = accuracy_score(y_test, y_pred)
print("\nAccuracy:")
print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

# Classification Report
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:\n")
print(cm)

plt.figure(figsize=(12, 12))
disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap="Blues", values_format="d")
plt.title("Confusion Matrix")
plt.savefig("confusion_matrix.png")
plt.show()

# Heatmap
plt.figure(figsize=(12, 10))

sns.heatmap(
    cm,
    cmap="Blues",
    annot=False,
    fmt="d"
)

plt.title("Confusion Matrix Heatmap")
plt.xlabel("Predicted Genre")
plt.ylabel("Actual Genre")
plt.savefig("heatmap.png")
plt.show()

# User Prediction
while True:
    user_input = input("\nEnter a movie description (or type 'exit' to quit): ")

    if user_input.lower() == "exit":
        print("Program Ended.")
        break
    
    cleaned = user_input.lower()
    cleaned = re.sub(r"[^\w\s]", "", cleaned)

    user_vector = vectorizer.transform([cleaned])

    prediction = model.predict(user_vector)

    print("Predicted Genre:", prediction[0])

# Genre Distribution Graph
genre_count = df["Genre"].value_counts().head(10)
plt.figure(figsize=(10, 6))
genre_count.plot(kind="bar")
plt.title("Top 10 Movie Genres")
plt.xlabel("Genres")
plt.ylabel("Number of Movies")
plt.tight_layout()
plt.savefig("genre_distribution.png")
plt.show()