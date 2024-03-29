from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings as django_settings
from django.views.decorators.csrf import csrf_exempt
from jmetal.algorithm.singleobjective.genetic_algorithm import GeneticAlgorithm
from jmetal.algorithm.multiobjective import NSGAII
from jmetal.operator import BinaryTournamentSelection
from jmetal.operator.crossover import PMXCrossover
from jmetal.operator.mutation import PermutationSwapMutation
from jmetal.problem.singleobjective.tsp import TSP
from jmetal.util.comparator import MultiComparator
from jmetal.util.density_estimator import CrowdingDistance
from jmetal.util.ranking import FastNonDominatedRanking
from jmetal.util.termination_criterion import StoppingByEvaluations
from processor.resources.tsp_problem import CENARIO1
from processor.resources.multi_problem import CVRP
from jmetal.util.solution import get_non_dominated_solutions, print_function_values_to_file, print_variables_to_file
from jmetal.lab.visualization import Plot
import numpy as np
import pandas as pd
import os
import pathlib
import json
import math


# Create your views here. localhost:8000/process
@csrf_exempt
def process(request):

    json_data = json.loads(request.body)
    
    optimization_array = json_data['optimization']
    number_of_objectives = len(list(filter(lambda x: x == 1, optimization_array)))

    if len(json_data['data_vehicles']) == 1 and json_data['optimization'][0] == 1:
        print("TSP Problem")
        solution = tsp_problem(json_data)
    elif number_of_objectives == 1:
        print("Single problem")
        solution = single_problem(json_data, number_of_objectives)
    else:
        print("Multi problem with %i objectives: " % (number_of_objectives))
        solution = multi_problem(json_data, number_of_objectives)
    print("Received solution to pass to frontend: ", solution)
    return JsonResponse(json.dumps(solution), safe=False)

############################# 
# Functions to run problems #
#############################

def tsp_problem(data: dict):
    problem = CENARIO1(instance=data)
    print('Cities: ', problem.number_of_variables)

    algorithm = GeneticAlgorithm(
        problem=problem,
        population_size=100,
        offspring_population_size=100,
        mutation=PermutationSwapMutation(1.0 / problem.number_of_variables),
        crossover=PMXCrossover(0.8),
        selection=BinaryTournamentSelection(
            MultiComparator([FastNonDominatedRanking.get_comparator(),
                                CrowdingDistance.get_comparator()])),
        termination_criterion=StoppingByEvaluations(max_evaluations=15000)
    )

    algorithm.run()
    result = algorithm.get_result()

    data = {}
    data["solutions"] = []
    sub_route = []
    sub_route.append({
        "vehicle": "0",
        "sub_route": result.variables[1:]
    })
    data["solutions"].append({
        "solution": "0",
        "route": sub_route
    })

    print('Algorithm: {}'.format(algorithm.get_name()))
    print('Problem: {}'.format(problem.get_name()))
    print('Solution: {}'.format(result.variables))
    print('Fitness: {}'.format(result.objectives[0]))
    print('Computing time: {}'.format(algorithm.total_computing_time))
    return data


def single_problem(data: dict, number_of_objectives: int):
    problem = CVRP(data,number_of_objectives)

    max_evaluations = len(data['data_vehicles']) * len(data['data_nodes']) * 1000
    dimension = number_of_objectives * len(data['data_vehicles']) * len(data['data_nodes']) * 10
    print("population_size: ", dimension)

    algorithm = GeneticAlgorithm(
        problem=problem,
        population_size=dimension,
        offspring_population_size=100,
        mutation=PermutationSwapMutation(1.0 / problem.number_of_variables),
        crossover=PMXCrossover(0.8),
        selection=BinaryTournamentSelection(
            MultiComparator([FastNonDominatedRanking.get_comparator(),
                                CrowdingDistance.get_comparator()])),
        termination_criterion=StoppingByEvaluations(max_evaluations=15000)
    )


    algorithm.run()
    result = algorithm.get_result()

    sub_route = []
    matrix_route = []
    for i in range(len(result.variables)):
        node = result.variables[i]
        if i == 0 and node < 0:
            matrix_route.append([])
        elif node > 0: # nó positivo --> append subroute
            sub_route.append(node)
        else: # nó negativo --> append matrix
            matrix_route.append(sub_route)
            sub_route = []
    matrix_route.append(sub_route)
    print("Matrix route single problem: ", matrix_route)
    # Each solution has a route
    data = {}
    data["solutions"] = []
    route_append = []
    for i in range(len(matrix_route)):
        route_append.append({
            "vehicle": str(i+1),
            "sub_route": matrix_route[i]
        })

            
    data["solutions"].append({
        "solution": "1",
        "route": route_append
    })

    print('Algorithm: {}'.format(algorithm.get_name()))
    print('Problem: {}'.format(problem.get_name()))
    print('Solution: {}'.format(result.variables))
    print('Fitness: {}'.format(result.objectives[0]))
    print('Computing time: {}'.format(algorithm.total_computing_time))
    return data


def multi_problem(data: dict, number_of_objectives: int):
    problem = CVRP(data,number_of_objectives)

    #max_evaluations = 15000 #veiculo * pontos_entrega * 1000
    max_evaluations = len(data['data_vehicles']) * len(data['data_nodes']) * 1000
    print("Number of evaluations: ", max_evaluations)
    dimension = number_of_objectives * len(data['data_vehicles']) * len(data['data_nodes']) * 10
    print("population_size: ", dimension)
    algorithm = NSGAII(
        problem=problem,
        population_size=dimension,
        offspring_population_size=dimension,
        mutation=PermutationSwapMutation(probability=0.2),
        crossover=PMXCrossover(probability=0.9),
        termination_criterion = StoppingByEvaluations(max_evaluations=max_evaluations)
    )


    algorithm.run()  

    result = algorithm.get_result()
    front = get_non_dominated_solutions(result)

    solutions_to_pass = []
    result_length = len(front)
    #Solucoes com menos de 3 objetivos
   
    array_index = calculate_solutions_more_2_objectives(front)
    for index in array_index:
        solutions_to_pass.append(front[index].variables)

    solution_frontend = []
    sub_route = []
    for solution in solutions_to_pass:
        sub_route = []
        matrix_route = []
        for i in range(len(solution)):
            node = solution[i]
            if i == 0 and node < 0:
                matrix_route.append([])
            elif node > 0: # nó positivo --> append subroute
                sub_route.append(node)
            else: # nó negativo --> append matrix
                matrix_route.append(sub_route)
                sub_route = []

        matrix_route.append(sub_route)
        solution_frontend.append(matrix_route)
        
    #Get vehicles ID's
    cars = []
    for vehicle in data['data_vehicles']:
        cars.append(vehicle['id'])

    # Each solution has a route
    data = {}
    data["solutions"] = []
    for i in range(len(solution_frontend)):
        route = solution_frontend[i]
        sub_route = []
        for k in range(len(route)):
            sub_route.append({
                "vehicle": str(k+1),
                "sub_route": route[k]
            })
        data["solutions"].append({
            "solution": str(i+1),
            "route": sub_route
        })
    print_function_values_to_file(front, 'output/tmp/FUN.'+ algorithm.get_name()+"-"+problem.get_name())
    print_variables_to_file(front, 'output/tmp/VAR.' + algorithm.get_name()+"-"+problem.get_name())

    print('Algorithm (continuous problem): ' + algorithm.get_name())
    print('Problem: ' + problem.get_name())
    print(front[0].objectives)
    print('Computing time: ' + str(algorithm.total_computing_time))
    print('Solution to pass to frontend', solutions_to_pass)
    return data


def calculate_pareto(objectives_array: list):
    print("Calculating front pareto")

    results_array = []
    for objective_array in objectives_array:
        total = 0
        for objective in objective_array.objectives:
            total += objective**2
        results_array.append(math.sqrt(total))
    
    front_pareto_index = results_array.index(min(results_array))
    print("Front pareto index: ", front_pareto_index)
    return front_pareto_index

def calculate_solutions_more_2_objectives(objectives_array: list):
    array_pd = []
    for solution in objectives_array:
        array_pd.append(solution.objectives)
    df = pd.DataFrame(array_pd)
    result = df.idxmin(axis=0, skipna=True)

    solution_index_each_objective = result.tolist()

    results_array = []
    for objective_array in objectives_array:
        total = 0
        for objective in objective_array.objectives:
            total += objective**2
        results_array.append(math.sqrt(total))
        
    front_pareto_index = results_array.index(min(results_array))
    solution_index_each_objective.append(front_pareto_index)
    print(solution_index_each_objective)


    print("Indexes of best solution each objective + frontpareto: ", solution_index_each_objective)
    return solution_index_each_objective