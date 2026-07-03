"""Train and save the Linear Regression model."""
import json

import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from app.config import (
    DATA_PATH,
    FEATURE_NAMES,
    METRICS_PATH,
    MODEL_PATH,
    RANDOM_STATE,
    TARGET_NAME,
    TEST_SIZE,
)


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. Place the dataset CSV in the data/ folder."
        )

    df = pd.read_csv(DATA_PATH)

    missing = {*FEATURE_NAMES, TARGET_NAME} - set(df.columns)
    if missing:
        raise ValueError(f"Dataset is missing required columns: {sorted(missing)}")

    X = df[FEATURE_NAMES]
    y = df[TARGET_NAME]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred) ** 0.5
    metrics = {
        "r2": round(float(r2_score(y_test, y_pred)), 4),
        "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
        "rmse": round(float(rmse), 2),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
    }

    coefficients = {
        name: round(float(coef), 4) for name, coef in zip(FEATURE_NAMES, model.coef_)
    }

    joblib.dump(model, MODEL_PATH)
    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(
            {
                "model_type": type(model).__name__,
                "intercept": round(float(model.intercept_), 4),
                "coefficients": coefficients,
                "metrics": metrics,
                "feature_names": FEATURE_NAMES,
            },
            f,
            indent=2,
        )

    print("Model trained and saved.")
    print(f"  Artifact : {MODEL_PATH}")
    print(f"  Metrics  : {metrics}")
    print("  Coefficients:")
    for name, coef in coefficients.items():
        print(f"    {name:>26}: {coef}")
    print(f"  Intercept: {round(float(model.intercept_), 4)}")


if __name__ == "__main__":
    main()
