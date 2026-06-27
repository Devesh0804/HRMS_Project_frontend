        const handleApiResponse = async (response) => {
            try {
                const data = await response.json(); // Assuming backend returns JSON
                
                if (response.ok) {
                    // Success case
                    return {
                        success: true,
                        message: data.message || 'Operation completed successfully',
                        data: data
                    };
                } else {
                    // Error case from backend
                    return {
                        success: false,
                        message: data.message || `Error: ${response.status} ${response.statusText}`,
                        data: null
                    };
                }
            } catch (error) {
                // Network or parsing error
                return {
                    success: false,
                    message: 'Network error or invalid response from server',
                    data: null
                };
            }
        };

export default handleApiResponse;