# Define the game logic
def check_bias_identification(bias_identified):
    required_biases = 3
    if len(bias_identified) >= required_biases:
        return 'WIN'
    else:
        return 'LOSE'

# Simulate the player's playthrough
bias_identified = ['sampling bias', 'selection bias', 'confirmation bias']

# Check the win condition
result = check_bias_identification(bias_identified)

# Print the final result
print(result)