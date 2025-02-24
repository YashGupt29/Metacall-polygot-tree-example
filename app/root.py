from metacall import metacall, metacall_load_from_file

metacall_load_from_file('js', ['./middleNode.js'])

def process_root(node):
    left = metacall('process_middle', 2 * node)
    right = metacall('process_middle', 2 * node + 1)
    return f"Root({node}) " + left + right
