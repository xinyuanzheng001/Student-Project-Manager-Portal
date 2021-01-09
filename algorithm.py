#!./mlenvironment.sh
import networkx as nx
import sys
import json

G=nx.DiGraph()

prefs = json.loads(sys.argv[1])
capacities = json.loads(sys.argv[2])

num_persons=len(prefs)
G.add_node('dest',demand=num_persons)
A=[]
result = dict()
for person,projectlist in prefs.items():
    G.add_node(person,demand=-1)
    for i,project in enumerate(projectlist):
        if i==0:
            cost=-100 # happy to assign first choice
        elif i==1:
            cost=-66 # slightly unhappy to assign second choice
        elif i==2:
            cost=-50 # ok to assign third choice
        else:
            cost=-33 # very unhappy to assign fourth choice
        G.add_edge(person,project,capacity=1,weight=cost) # Edge taken if person does this project

for project,c in capacities.items():
        G.add_edge(project,'dest',capacity=c,weight=0)


flowdict = nx.min_cost_flow(G)

for person, projectlist in prefs.items():
    for project,flow in flowdict[person].items():
        if flow:
            # print (person,'joins',project)
            if project in result:
                result[project].append(person)
            else:
                result[project] = [person]
result = json.dumps(result)
print(result)