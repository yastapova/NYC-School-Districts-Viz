import csv


def add_to_district(final, district, level, overall, env, perf, prog):
    '''Add one school's data to the district'''

    final[district]["totals"]["num_schools"] += 1
    final[district]["totals"][level] += 1

    final[district]["grades"]["totals"]["overall"][overall] += 1
    final[district]["grades"]["totals"]["environment"][env] += 1
    final[district]["grades"]["totals"]["performance"][perf] += 1
    final[district]["grades"]["totals"]["progress"][prog] += 1

    final[district]["grades"]["overall"][level][overall] += 1
    final[district]["grades"]["environment"][level][env] += 1
    final[district]["grades"]["performance"][level][perf] += 1
    final[district]["grades"]["progress"][level][prog] += 1

    return final


filename = "data/2009_-_2010_School_Progress_Reports_-_All_Schools.csv"
with open(filename, "r") as f:
    reader = csv.reader(f, delimiter=",")
    lines = list(reader)

header = lines.pop(0)

types = {"Elementary" : "ES", "Middle" : "MS", "High School" : "HS",
    "K-2" : "K2", "K-3" : "K3", "K-8" : "K8",
    "High School Transfer" : "HST", "YABC" : "YABC"}
levels_list = ["ES", "MS", "HS", "K2", "K3", "K8", "HST", "YABC"]
grades = ["A", "B", "C", "D", "F", "NA"]
relative_sections = ["overall", "environment", "performance", "progress"]

final = {}

for line in lines:
    # get data
    district = line[1]
    level = line[5]
    overall = line[7]
    env = line[10]
    perf = line[12]
    prog = line[14]

    # modify data
    level = types[level]
    if overall == "":
        overall = "NA"
    if env == "":
        env = "NA"
    if perf == "":
        perf = "NA"
    if prog == "":
        prog = "NA"

    # create dictionary
    if district in final:
        # add data to district
        final = add_to_district(final, district, level, overall, env, perf, prog)
    else:
        # create new district
        final[district] = {
            "totals" : {
                "num_schools" : 0,
                "ES" : 0,
                "MS" : 0,
                "HS" : 0,
                "K2" : 0,
                "K3" : 0,
                "K8" : 0,
                "HST" : 0,
                "YABC" : 0
            },
            "grades" : {
                "totals" : {
                    "overall" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "environment" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "performance" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "progress" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                },
                "relative" : {
                    "overall" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "environment" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "performance" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "progress" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                },
                "overall" : {
                    "ES" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "MS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K2" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K3" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K8" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HST" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "YABC" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                },
                "environment" : {
                    "ES" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "MS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K2" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K3" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K8" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HST" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "YABC" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                },
                "performance" : {
                    "ES" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "MS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K2" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K3" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K8" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HST" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "YABC" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                },
                "progress" : {
                    "ES" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "MS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HS" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K2" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K3" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "K8" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "HST" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    },
                    "YABC" : {
                        "A" : 0,
                        "B" : 0,
                        "C" : 0,
                        "D" : 0,
                        "F" : 0,
                        "NA" : 0
                    }
                }
            }
        }

        # add data to district
        final = add_to_district(final, district, level, overall, env, perf, prog)

# calculate relatives
for dist in list(final.keys()):
    for category in relative_sections:
        for grade in grades:
            final[dist]["grades"]["relative"][category][grade] = final[dist]["grades"]["totals"][category][grade] / final[dist]["totals"]["num_schools"]

# write to csv
new_header = ["district", "num_schools", "num_ES", "num_MS", "num_HS", "num_K2", "num_K3", "num_K8", "num_HST", "num_YABC",
              "total_overall_A", "total_overall_B", "total_overall_C", "total_overall_D", "total_overall_F", "total_overall_NA",
              "total_env_A", "total_env_B", "total_env_C", "total_env_D", "total_env_F", "total_env_NA",
              "total_perf_A", "total_perf_B", "total_perf_C", "total_perf_D", "total_perf_F", "total_perf_NA",
              "total_prog_A", "total_prog_B", "total_prog_C", "total_prog_D", "total_prog_F", "total_prog_NA",
              "relative_overall_A", "relative_overall_B", "relative_overall_C", "relative_overall_D", "relative_overall_F", "relative_overall_NA",
              "relative_env_A", "relative_env_B", "relative_env_C", "relative_env_D", "relative_env_F", "relative_env_NA",
              "relative_perf_A", "relative_perf_B", "relative_perf_C", "relative_perf_D", "relative_perf_F", "relative_perf_NA",
              "relative_prog_A", "relative_prog_B", "relative_prog_C", "relative_prog_D", "relative_prog_F", "relative_prog_NA"]

result_filename = "data/reorganized_data.csv"
with open(result_filename, "w") as f:
    writer = csv.writer(f, delimiter=",", lineterminator="\n")
    writer.writerow(new_header)

    for dist in list(final.keys()):
        line = []
        line.append(dist)
        line.append(final[dist]["totals"]["num_schools"])
        for level in levels_list:
            line.append(final[dist]["totals"][level])

        for category in relative_sections:
            for grade in grades:
                line.append(final[dist]["grades"]["totals"][category][grade])

        for category in relative_sections:
            for grade in grades:
                line.append(final[dist]["grades"]["relative"][category][grade])

        writer.writerow(line)
