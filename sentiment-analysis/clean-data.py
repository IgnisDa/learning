import argparse
import csv
import random


def clean_csv(input_path, output_path):
    with open(input_path) as file:
        # extract all the fieldnames from the first line
        fieldnames = file.read().splitlines()[0].split(",")
        # we store the length so that we can check later if all the fields exist
        # in a row and only then write it to the file
        # This functionality is not really used because all the datasets I download
        # from the net are mostly incomplete
        num_fields = len(fieldnames)  # noqa: F841
    with open(input_path) as file:
        csv_dict_reader_object = list(csv.DictReader(file, fieldnames=fieldnames))
        random.shuffle(csv_dict_reader_object)

        with open(output_path, "w") as write_file:
            csv_dict_writer_object = csv.DictWriter(write_file, fieldnames=fieldnames)
            csv_dict_writer_object.writeheader()

            for index, row in enumerate(csv_dict_reader_object, 1):
                if index == 1000:
                    break
                csv_dict_writer_object.writerow(row)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Takes an input csv file and trims it to the first 1000 rows"
    )
    parser.add_argument(
        "input_path", metavar="input_path", type=str, help="path to the input file"
    )
    parser.add_argument(
        "--output-path",
        metavar="output_path",
        type=str,
        help="path to the output file",
        default="output.csv",
    )
    args = parser.parse_args()
    input_path = args.input_path
    output_path = args.output_path
    clean_csv(input_path, output_path)
