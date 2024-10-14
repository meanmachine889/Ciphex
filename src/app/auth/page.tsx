import {AuthPage} from "@/components/authpage";
import {Condom} from "@/helpers/Condom";

export default function Home() {
    return (
        <Condom>
            <div className={"w-[100%] h-[100vh] flex items-center justify-center"}>
                <AuthPage/>
            </div>
        </Condom>
    );
}
