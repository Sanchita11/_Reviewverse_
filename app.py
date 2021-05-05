#%%
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
import sys
import json

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

lines = str(read_in())

metadata = pd.read_csv('ML_Files/movies_metadata.csv',low_memory=False)

from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(stop_words='english')

metadata['overview'] = metadata['overview'].fillna('')

tfidf_matrix = tfidf.fit_transform(metadata['overview'])

tfidf_matrix = tfidf_matrix[0:22733]

from sklearn.metrics.pairwise import linear_kernel

cosine_sim = linear_kernel(tfidf_matrix,tfidf_matrix)

indices = pd.Series(metadata.index,index = metadata['title']).drop_duplicates()

def get_recommendations(title,cosine_sim=cosine_sim):

    idx = indices[title]

    sim_score = list(enumerate(cosine_sim[idx]))

    sim_score = sorted(sim_score,key = lambda x:x[1],reverse = True)

    sim_score = sim_score[1:11]

    movie_indices = [i[0] for i in sim_score]

    return metadata['title'].iloc[movie_indices]


print(get_recommendations(lines))


# %%
