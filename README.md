# tarjs
Command-line tar utility

# Installation

    npm install -g tarjs-cli

# Usage

    tarjs [options] [files]

Multiple input files and directories can be specified.

# Options

## `-c, --create`

Creates a new tar archive. When this option is specified, the following options are required:

 - The output file name (`-f`)
 - One or more input files or directories, specified after the options

 ## `-t, --list`

 Lists the contents of a tar archive. When this option is specified, the input file name (`-f`) is required.

 ## `-v, --verbose`

 Shows additional output.

 ## `-q, --quiet`

 Shows minimal output. This is useful for using `tarjs` in scripts.

 ## `--portable`

 Creates a tar archive without system-specific metadata. This allows you to create a tar file with the same checksum on different computers.

 ## `-f, --file`

 The file to operate on.
 
 When creating (`-c`), this is the name of the output file. It will be overwritten if it already exists.

 When listing (`-t`), this is the name of the input file.

 ## `-C, --change`

 The directory to change into before adding the files to the tar archive. This can also be thought of as the base directory for the specified files and directories.
