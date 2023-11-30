import { useQuery } from "@tanstack/react-query";
import ArticlesTable from "./ArticlesTable";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyArticles = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const email = user?.email;


    // tanstackquery
    const { data: myArticles = [], isLoading, refetch } = useQuery({
        queryKey: ["myArticles"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/articleByAuthor/${email}`)
            return res.data;
        }
    })




    // handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/articles/${id}`)
                    .then(res => {
                        const data = res.data;
                        console.log(data);
                        let timerInterval;
                        Swal.fire({
                            title: "Deletion in process...!",
                            html: "Article will be deleted <b></b> milliseconds.",
                            timer: 1000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading();
                                const timer = Swal.getPopup().querySelector("b");
                                timerInterval = setInterval(() => {
                                    timer.textContent = `${Swal.getTimerLeft()}`;
                                }, 100);
                            },
                            willClose: () => {
                                clearInterval(timerInterval);
                            }
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                refetch();
                            }
                        });

                    })
            }
        });

    }


    // checking loading state of articles
    if (isLoading) {
        return <div className="flex bg-white justify-center mt-28 mb-28 lg:mt-80 lg:mb-60">
            <progress className="progress w-56  h-2 lg:h-8 lg:w-80"></progress>
        </div>
    }

    return (
        <div className="overflow-x-auto bg-green-50">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Delete</th>
                        <th>Title & image</th>
                        <th>Publisher name</th>
                        <th>Premium article</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>View details</th>
                    </tr>
                </thead>
                <tbody>
                    {/* rows */}
                    {
                        myArticles?.map((data, index) => <ArticlesTable
                            key={data._id}
                            data={data}
                            index={index}
                            handleDelete={handleDelete}
                        >
                        </ArticlesTable>)
                    }
                </tbody>

            </table>
        </div>
    );
};

export default MyArticles;