from datetime import datetime
import traceback
import pandas as pd
import joblib
from io import StringIO
import configparser
config = configparser.ConfigParser()
config.read('config.ini')
model_loc = config['Default']['model_location']
col_loc = config['Default']['col_location']


def predict(test_query: str):
    """
    The main predict method. It loads an existing ML model, takes a test query as input and then tests the query against
    the model.
    @param test_query: CSV style string with header.
    """
    try:
        # Load model and column
        knn_loaded = joblib.load(model_loc)
        model_columns = joblib.load(col_loc)
        # Convert query data into dataframe
        test_query = StringIO(test_query)
        test_df = pd.read_csv(test_query)
        # Remove the cpu percent as cpu percent avg is better measure
        test_df = test_df.select_dtypes(exclude=['object'])
        test_df = test_df.reindex(columns=model_columns)
        # Predict
        prediction = list(knn_loaded.predict(test_df))
        return prediction
    except Exception as ex:
        print(str(datetime.now()) + ":")
        traceback.print_exc()
        raise (ex)
